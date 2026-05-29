const { Notification } = require('../models');

exports.createNotification = async (message, type = 'info') => {
  const note = await Notification.create({ message, type });
  return note;
};

exports.list = async () => {
  return Notification.findAll({ order: [['createdAt', 'DESC']] });
};
