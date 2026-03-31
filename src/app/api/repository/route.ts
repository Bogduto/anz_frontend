import { NextResponse } from "next/server";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    // get access token from request headers

    // make a request to supabase to get the repository details using the id and access token

    return NextResponse.json({
        repositories: []
    },
        {
            status: 200,
        }
    );

} 