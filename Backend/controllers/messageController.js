const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");

const getMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [messages, totalMessagesCount] = await Promise.all([ messageModel
      .find({ conversationId })
      .populate("senderId", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
      messageModel.countDocuments({ conversationId })
    ])

    const totalPages = Math.ceil(totalMessagesCount / limit) || 0;

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages: messages.reverse(),
      totalPages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getMessages API",
      error,
    });
  }
}

module.exports = { getMessages };
