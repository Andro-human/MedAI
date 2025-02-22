const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const { emitEvent } = require("../utils/features");

const getMyConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await conversationModel
      .find({
        members: { $in: [userId] },
      })
      .populate("members", "name avatar");
      
    const transformedConversations = conversations.map(
      ({ _id, members }) => {
          //  console.log("members", members);
        const otherMember = members.filter(
          (member) => member._id.toString() !== userId.toString()
        );

        return {
          _id,
          name: otherMember[0].name,
          avatar: otherMember[0].avatar.url,
          members: otherMember[0].id,
        };
      }
    );

    return res.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      conversation: transformedConversations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getMyConversations API",
      error,
    });
  }
};

const getConversationDetails = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    // const senderId = req.userId;
    
    if (req.query.populate === "true") {
      const conversation = await conversationModel
        .findById(conversationId)
        .populate("members", "name avatar")
        .lean(); // lean() is used to convert the mongoose object to plain javascript object

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "No conversation found",
        });
      }

      conversation.members = conversation.members.map(
        ({ _id, name, avatar }) => {
          return {
            _id,
            name,
            avatar: avatar.url,
          };
        }
      );

      res.status(200).json({
        success: true,
        message: "Conversation details fetched successfully",
        conversation,
      });
    } else {
      const conversation = await conversationModel.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "No conversation found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Conversation details fetched successfully",
        conversation,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching conversation details",
      error,
    });
  }
};

const createConversation = async (req, res) => {
  try {
    const { otherMemberId } = req.body;
    const senderId = req.userId;

    const conversationExists = await conversationModel.findOne({
      members: { $all: [senderId, otherMemberId] }, 
    });

    if (conversationExists) {
      return res.status(403).json({
        success: false,
        message: "Conversation already exists",
        conversation: conversationExists,
      });
    }
    
    const currentUser = await userModel.findById(senderId).select("name");
    const otherMember = await userModel.findById(otherMemberId).select("name");

    if (!otherMember) {
      return res.status(400).json({
        success: false,
        message: "Other Member is required",
      });
    }

    const conversation = await conversationModel.create({
      name: `${otherMember.name} - ${currentUser.name}`,
      members: [senderId, otherMemberId],    
    });

    emitEvent(req, "refetchChats");
    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in createConversation API",
      error,
    });
  }
}

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await conversationModel.findById(id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const members = conversation.members;
    if (!members.includes(req.userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this conversation",
      });
    }

    //here we have to delete the messages also
    await Promise.all([
      messageModel.deleteMany({ conversationId: id }),
      conversationModel.findByIdAndDelete(id),
    ]);

    emitEvent(req, "refetchChats");
     

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleteChat API",
      error,
    });
  }
};





module.exports = { getMyConversations, getConversationDetails, deleteConversation, createConversation };
