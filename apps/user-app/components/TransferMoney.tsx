"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import prisma from "@repo/db/client";
import { useSession } from "next-auth/react";
import { authOptions } from "../app/lib/auth";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransactions";
import { P2ptransfer } from "../app/lib/actions/p2pTransfer";

export const TransferMoney = () => {
  const [number, setNumber] = useState(0);
  const [amount, setAmount] = useState(0);
  return (
    <Card title="Send Money">
      <div className="w-full">
        <TextInput
          label={"Phone No"}
          placeholder={"123123123"}
          onChange={(value) => {
            setNumber(Number(value));
          }}
        />
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value) => {
            setAmount(Number(value));
          }}
        />

        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              await P2ptransfer(number, Number(amount) * 100);
            }}
          >
            PAY
          </Button>
        </div>
      </div>
    </Card>
  );
};
