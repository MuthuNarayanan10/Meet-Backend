module.exports = function (socket) {
    socket.on('current_location', async (data) => {
        console.log('inside current_location', data)
    });
}