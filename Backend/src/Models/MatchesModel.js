// Local Imports:
import Model from '../Core/Model.js';

class MatchesModel extends Model {
    constructor() {
        super('matches');
    }

    async findMatchId(userIdOne, userIdTwo) {
        let reference = {
            user_id_1: userIdOne,
            user_id_2: userIdTwo
        }

        let match = await this.getByReference(reference, false);
        if (!match) return null;
        if (match.length === 0) {
            reference = {
                user_id_1: userIdTwo,
                user_id_2: userIdOne
            }
    
            match = await this.getByReference(reference, false);
            if (!match) return null;
        }

        return match.id;
    }
}

const matchesModel = new MatchesModel();
export default matchesModel;
