import { NextResponse } from 'next/server'
export async function GET(request: Request, { params }: { params: { slug: string } }) {
    console.log(params)
    const type = params.type.toUpperCase()
    const number = parseInt(params.count)
    const responseJson = {
        "title": `${type} - #${number}`,
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": `${type} - #${number}`,
            },
            "description": {
                "type": "string",
                "description": "this is how it works",
            },
            "image": {
                "type": "string",
                "description": "https://nyckidsrise.org/wp-content/uploads/2021/08/olmos_NYC-kids-RISE-8530_1920x1200.jpg",
            }
        }
    }

    return NextResponse.json(responseJson)
}