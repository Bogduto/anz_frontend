import { NextResponse } from "next/server";



export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    const { id } = params;

    // get access token from request headers

    // make a request to supabase to get the repository details using the id and access token

    return NextResponse.json({
        id,
        name: `Repository ${id}`,
    },
        {
            status: 200,
        }
    );
    
} 