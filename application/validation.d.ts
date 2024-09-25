import * as v from "valibot";
declare const dataSchema: v.ArraySchema<
  v.ObjectSchema<
    {
      first: v.StringSchema<string>;
      last: v.StringSchema<string>;
      email: v.StringSchema<string>;
      address: v.StringSchema<string>;
      created: v.StringSchema<string>;
      balance: v.StringSchema<string>;
    },
    undefined,
    {
      address: string;
      email: string;
      balance: string;
      first: string;
      last: string;
      created: string;
    }
  >,
  {
    address: string;
    email: string;
    balance: string;
    first: string;
    last: string;
    created: string;
  }[]
>;
export type Data = v.Output<typeof dataSchema>;
export declare const validateData: (data: unknown) => Data;
export {};
