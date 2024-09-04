import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class StickyStatus extends Model {
    static associate(models) {
      this.belongsTo(models.Sticky, {
        foreignKey: 'stickyId',
        onDelete: 'CASCADE'
      });
      this.belongsTo(models.User, {
        foreignKey: 'receiverId',
        onDelete: 'CASCADE'
      });
    }
  }
  StickyStatus.init({
    stickyId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    showHide: DataTypes.BOOLEAN,
    importance: DataTypes.INTEGER,
    posX: DataTypes.INTEGER,
    posY: DataTypes.INTEGER,
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'StickyStatus',
  });
  return StickyStatus;
};