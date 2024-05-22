import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error:'Please sign in to create a post'})
    }
    const {  title,
        content,
        links,
        imageUrl,
        publicId,
        selectedCategory,
        } = await req.json();

        const authorEmail = session?.user?.email as string;

        if(!title || !content){
            return NextResponse.json( {error: 'Missing title or content'},
             {status: 500})
        }
       
        try {
            const newPost = await prisma.post.create({
             data:{
                title,
                content,
                links,
                imageUrl,
                publicId,
                catName: selectedCategory,
                authorEmail,
             },
            });
            console.log("post created", newPost);
            return NextResponse.json(newPost)
        } catch (error) {
            return NextResponse.json({message:"COULD NOT CREATE POST"})
        }
}

export async function GET(){
    try {
        const posts = await prisma.post.findMany({
            include:{author:{select:{name:true}}}, orderBy:{
                createdAt: 'desc'
            }
        })
        return NextResponse.json(posts)
    } catch (error) {
        console.log(error, "something wrong happend while getting posts");
        return NextResponse.json({message:"Something went wrong while getting posts"}, 
        {status: 500})
    }
}