import date from 'date-and-time';
import Entry from '../models/entryModel';
import response from '../helpers/response';
import Token from '../helpers/tokens';
import notNumber from '../helpers/notNumber';

let entries = [];

class EntryController {
  static createEntry = (req, res) => {
    const { title, description } = req.body;
    const id = entries.length + 1;
    const now = new Date();
    const currentDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');
    const updateDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');
    const userid = Token.verifyToken(req.header('x-auth-token'));
    const entry = new Entry(id, currentDate, userid, title, description, updateDate);
    entries.push(entry);
    const data = entry;
    return response.successMessage(req, res, 200, 'entry successfully created', data);
  }

  static modifyEntry = (req, res) => {
    const { title, description } = req.body;
    const { entryId } = req.params;
    const now = new Date();
    const newDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');
    const userid = Token.verifyToken(req.header('x-auth-token'));
    const singleEntry = entries.find((entry) => entry.id === parseInt(entryId, 10));
    if (isNaN(entryId)) { return notNumber(req, res); }
    if (!singleEntry) {
      return response.errorMessage(req, res, 404, `An entry with Id ${entryId} does not exist`);
    }
    if (userid !== singleEntry.id) {
      return response.errorMessage(req, res, 403, `An entry with Id ${entryId} does not belongs to you`);
    }
    singleEntry.title = title;
    singleEntry.description = description;
    singleEntry.updatedOn = newDate;
    const data = singleEntry;

    return response.successMessage(req, res, 200, 'entry successfully edited', data);
  }

  static getAllentries = (req, res) => {
    const userData = Token.verifyToken(req.header('x-auth-token'));
    const data = entries.sort((a, b) => (new Date(b.updatedOn)).getTime()
      - (new Date(a.updatedOn).getTime()));
    const yourEntries = data.filter((entry) => entry.userid === userData);
    if (yourEntries.length === 0) {
      return response.errorMessage(req, res, 404, 'Your entries  are not found!');
    }
    return response.successMessage(req, res, 200, 'Your available entries are: ', yourEntries);
  };

  static getSpecificEntry = (req, res) => {
    const { entryId } = req.params;
    const userInfos = Token.verifyToken(req.header('x-auth-token'));
    const uniqueEntry = entries.find((entry) => entry.id === parseInt(entryId, 10));
    if (isNaN(entryId)) { return notNumber(req, res); }
    if (!uniqueEntry) {
      return response.errorMessage(req, res, 404, 'This entry is not fouund');
    }
    if (uniqueEntry.userid !== userInfos) {
      return response.errorMessage(req, res, 403, 'This entry is not yours');
    }
    return response.successMessage(req, res, 200, 'Your Entry was found', uniqueEntry);
  }

  static deleteEntry = (req, res) => {
    const { entryId } = req.params;
    const userInfo = Token.verifyToken(req.header('x-auth-token'));
    const oneEntry = entries.find((uniqueEntry) => uniqueEntry.id === parseInt(entryId, 10));
    if (isNaN(entryId)) { return notNumber(req, res); }
    if (!oneEntry) {
      return response.errorMessage(req, res, 404, 'This entry is not avaialable');
    }
    if (oneEntry.userid !== userInfo) {
      return response.errorMessage(req, res, 403, 'This entry doesn\'t belongs to you');
    }
    const index = entries.indexOf(oneEntry);
    entries.splice(index, 1);
    return response.successMessage(req, res, 200, 'entry successfully deleted', oneEntry);
  }
}
export default EntryController;
