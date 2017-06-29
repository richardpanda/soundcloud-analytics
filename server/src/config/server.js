let port = 4000;

if (process.env.NODE_ENV === 'test') {
  port = 4001;
}

export default {
  port,
};
