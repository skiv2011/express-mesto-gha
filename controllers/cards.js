const mongoose = require('mongoose');
const { statusCode } = require('../utils/errors');
const Card = require('../models/card');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const mongoPatchConfig = { new: true };

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(statusCode.OK).send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });
    res.status(statusCode.OK).send(newCard);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка с таким таким id не найдена.'));
      return;
    }
    if (req.user._id !== card.owner.toString()) {
      next(new ForbiddenError('Это не ваша карточка!'));
      return;
    }
    const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
    res.status(statusCode.OK).send(deletedCard);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new ValidationError('Неверный формат id карточки.'));
    } else {
      next(err);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      mongoPatchConfig,
    );
    if (!card) {
      next(new NotFoundError('Карточка с таким таким id не найдена.'));
      return;
    }
    res.status(statusCode.OK).send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      mongoPatchConfig,
    );
    if (!card) {
      next(new NotFoundError('Карточка с таким таким id не найдена.'));
      return;
    }
    res.status(statusCode.OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new ValidationError('Неверный формат у id карточки.'));
    } else {
      next(err);
    }
  }
};
