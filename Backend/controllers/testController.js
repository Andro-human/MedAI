const testController = (req, res) => {
    return res.status(200).send({
        success: "true",
        message: 'Welcome to MedAI'
    })
}

module.exports = {testController}