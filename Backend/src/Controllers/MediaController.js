// Third-Party Imports:
import path from 'path';

// Local Imports:
import audioChatMessagesModel from '../Models/AudioChatMessagesModel.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class MediaController {
    static async getAudioById(req, res) {
        const { id } = req.params;

        const result = await audioChatMessagesModel.getById({ id });
        if (!result)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (result.length === 0)
            return res.status(404).json({ msg: StatusMessage.AUDIO_NOT_FOUND });

        const audio = result.audio_path;
        const audioPath = path.join(audio);
        res.sendFile(audioPath, (error) => {
            if (error) {
                res.status(404).json({ msg: StatusMessage.AUDIO_NOT_FOUND });
            }
        });
    }
}
