import { parse } from 'id3-parser';

export default async (buff) => {
  let tags;
  try {
    tags = parse(new Uint8Array(buff));
  } catch (error) {
    tags = {};
  }

  return tags;
};
