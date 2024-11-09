import { HttpStatusCodes } from "@/common/constants";
import Context from "@/common/context";
import LOGGER from "@/common/logger";
import { User } from "@/db/models/user";
import { ProfileObj } from "@/interfaces/dto";
import { IUser } from "@/interfaces/model";
import { IJwtPayload, signJwt } from "@/middlewares";
import createError from "http-errors";
import fs from 'fs'

const updateProfile = async (context: Context, profile: ProfileObj) => {
  if (!context?.user?.userId)
    throw createError(HttpStatusCodes.BAD_REQUEST, `UserId not found`);

  const { userId } = context?.user;

  LOGGER.debug(`name: ${JSON.stringify(profile)}`);

  const user = (await User.findOneAndUpdate(
    { _id: userId, deleted: false },
    { $set: { name: profile?.name } },
    { upsert: true, new: true }
  )) as IUser;

  const payload: IJwtPayload = {
    user: {
      userId: user?._id,
      email: user?.email || "",
      name: user?.name || "",
    },
  };
  const token = signJwt(payload);
  const userObj = {
    token,
    user,
  };
  return userObj;
};


const generateCSV = async () => {
  const fs = require('fs');
  const csv = require('csv-parser');
  const { Transform } = require('stream');

  const clusterCount = new Map();
  const sortedEntries: any[] = [];

  const readStream = fs.createReadStream('/Users/vagishdilawari/Downloads/output.csv');
  const writeStream = fs.createWriteStream('/Users/vagishdilawari/Downloads/output_1.csv');

  readStream
    .pipe(csv())
    .pipe(new Transform({
      transform(chunk: any, encoding: any, callback: any) {
        const clusterId = chunk['Cluster ID'];
        if (clusterId) {
          clusterCount.has(clusterId) ? clusterCount.set(clusterId, clusterCount.get(clusterId) + 1) : clusterCount.set(clusterId, 1);
        }
        callback(null, chunk);
      },
      flush(callback: any) {
        clusterCount.forEach((count, clusterId) => {
          sortedEntries.push({ clusterId, count });
        });
        sortedEntries.sort((a, b) => b.count - a.count);
        callback();
      }
    }))
    .pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('CSV file has been sorted and written.');
  });
};

const UserService = {
  updateProfile,
  generateCSV,
};

export default UserService;
