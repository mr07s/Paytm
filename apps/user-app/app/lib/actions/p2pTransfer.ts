"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function P2ptransfer(to: number, amount: number) {
  const session = await getServerSession(authOptions);
  const formUser = session?.user?.id;
  console.log(formUser);
  if (!formUser) {
    return {
      message: "User is unauthenticated",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number: String(to),
    },
  });
  if (!toUser) {
    return {
      message: "Receiver not found",
    };
  }
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(formUser)} FOR UPDATE`;
    const fromBalance = await tx.balance.findUnique({
      where: {
        userId: Number(formUser),
      },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient Balance");
    }
    await tx.balance.update({
      where: {
        userId: Number(formUser),
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    });
    await tx.balance.update({
      where: { userId: Number(toUser.id) },
      data: { amount: { increment: amount } },
    });
    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(formUser),
        toUserId: Number(toUser.id),
        amount,
        timestamp: new Date(),
      },
    });
  });
}
