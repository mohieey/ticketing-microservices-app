export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, CB: () => void) => {
        CB();
      }),
  },
};
