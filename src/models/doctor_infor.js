'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_infor.belongsTo(models.User, { foreignKey: 'doctorId' });
            Doctor_infor.belongsTo(models.MarkDown, { foreignKey: 'doctorId', targetKey: 'doctorId' });
        }
    }
    Doctor_infor.init(
        {
            doctorId: DataTypes.STRING,
            priceId: DataTypes.STRING,
            specialistId: DataTypes.INTEGER,
            clinicId: DataTypes.INTEGER,

            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Doctor_infor',
        },
    );
    return Doctor_infor;
};
