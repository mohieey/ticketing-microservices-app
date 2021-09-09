export const natsWrapper = {
  client: {
    publish(subject: string, data: string, CB: () => void) {
      CB();
    },
  },
};
