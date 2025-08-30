import * as path from 'path';
import * as fs from 'fs';

export const filename = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);

  callback(null, `${name}${fileExtName}`);
};

export const destination = (req, file, cb) => {
  const filePath = path.join(
    __dirname,
    '../../',
    `/public/images/hotel-room/${req.body.id}`,
  );

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  cb(null, filePath);
};
