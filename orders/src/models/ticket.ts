import mongoose from "mongoose";

import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//Add a method to Model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

//Add a method to Document
ticketSchema.methods.isReserved = async function () {
  //this === the ticket doc that we called isReserved on

  const validOrderWithTheSameTicket = await Order.findOne({
    //@ts-ignore
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!validOrderWithTheSameTicket;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
