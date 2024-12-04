// see https://zenn.dev/tatsuyasusukida/articles/sequelize-cjs-to-esm
import Account from './account.js';
import AccountClass from './accountclass.js';
import AccountRemaining from './accountremaining.js';
import CrossSlip from './crossslip.js';
import CrossSlipDetail from './crossslipdetail.js';
import Customer from './customer.js';
import FiscalYear from './fiscalyear.js';
import Invoice from './invoice.js';
import InvoiceDetail from './invoicedetail.js';
import MonthlyLog from './monthlylog.js';
import Item from './item.js';
import ItemClass from './itemclass.js';
import ItemFile from './itemfile.js';
import Sticky from './sticky.js';
import StickyStatus from './stickystatus.js';
import SubAccount from './subaccount.js';
import SubAccountRemaining from './subaccountremaining.js';
import User from './user.js';
import Voucher from './voucher.js';
import VoucherFile from './voucherfile.js';
import {Sequelize, DataTypes} from 'sequelize';
import fs from 'fs';

const env = process.env.NODE_ENV || 'development';

const jsonData = JSON.parse(fs.readFileSync('config/config.json', 'utf-8'));
const config = jsonData[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const models = {
  Account: Account(sequelize, DataTypes),
  AccountClass: AccountClass(sequelize, DataTypes),
  AccountRemaining: AccountRemaining(sequelize, DataTypes),
  CrossSlip: CrossSlip(sequelize, DataTypes),
  CrossSlipDetail: CrossSlipDetail(sequelize, DataTypes),
  Customer: Customer(sequelize, DataTypes),
  FiscalYear: FiscalYear(sequelize, DataTypes),
  Invoice: Invoice(sequelize, DataTypes),
  InvoiceDetail: InvoiceDetail(sequelize, DataTypes),
  Item: Item(sequelize, DataTypes),
  ItemClass: ItemClass(sequelize, DataTypes),
  ItemFile: ItemFile(sequelize, DataTypes),
  MonthlyLog: MonthlyLog(sequelize, DataTypes),
  Sticky: Sticky(sequelize, DataTypes),
  StickyStatus: StickyStatus(sequelize, DataTypes),
  SubAccount: SubAccount(sequelize, DataTypes),
  SubAccountRemaining: SubAccountRemaining(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
  Voucher: Voucher(sequelize, DataTypes),
  VoucherFile: VoucherFile(sequelize, DataTypes)
}

Object.keys(models).forEach(key => {
  if (models[key].associate) {
    models[key].associate(models)
  }
})

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
