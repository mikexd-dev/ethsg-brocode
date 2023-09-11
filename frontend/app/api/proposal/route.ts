import { NextRequest } from "next/server";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const res = await request.json();

  const proposalUrl = res.proposalUrl;
  const proposalResponse = await fetch(proposalUrl);
  const proposalJson = await proposalResponse.json();
  return NextResponse.json(proposalJson);
}
