import * as functions from "firebase-functions";
import updateGuildFunc from './updateGuild';

export const updateGuild = functions.https.onCall(updateGuildFunc);

