import { connect } from "mongoose";

export default async () => connect(process.env.DATABASE_URL);
