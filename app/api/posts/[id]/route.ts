import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, 
    {params}: {params: {id: string}}){
        try {
            const id = params.id;
            const post = await prisma.post.findUnique({where:{id}})
            return NextResponse.json(post)
        } catch (error) {
            console.log(error)
            return NextResponse.json({message:"Something went wrong while getting post"})
            
        }
        
    }

    export async function PUT(req: Request, 
        {params}: {params: {id: string}}){
            const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error:'Please sign in to create a post'})
    }
           const {  title, content, links, selectedCategory, imageUrl,publicId}= 
           await req.json();
            const id = params.id
            try {
                const post = await prisma.post.update({
                    where:{id},
                    data:{
                        title,
                        content,
                        links,
                        imageUrl,
                        publicId,
                        catName: selectedCategory
                    }
                })
                return NextResponse.json(post)
            } catch (error) {
                console.log(error);
                return NextResponse.json({message:"Something went wrong while updating post"})
            }

    }


    
  export async function DELETE(req: Request, 
    {params}: {params: {id: string}}){
        const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error:'Please sign in to create a post'})
    }
        const id = params.id
        try {
            const post = await prisma.post.delete({where:{id}})
            return NextResponse.json(post)
        } catch (error) {
            console.log(error);
            return NextResponse.json({message:"Something went wrong while deleting post"})
        }
    } 

    // 26 11