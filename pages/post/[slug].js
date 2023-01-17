import React, { useState } from "react";
import Header from "@/components/Header";
import { GetStaticPaths } from "next";
import { GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { useForm, SubmitHandler } from "react-hook-form";

import PortableText from "react-portable-text";
function Post(props) {
  const [submited, setsubmited] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((data) => {
        console.log(data);
        setsubmited(true);
      })
      .catch((err) => {
        console.log(err);
        setsubmited(false);
      });
  };
  return (
    <main>
      <Header></Header>
      <img
        className="w-full lg:w-[60%] bg-black mx-auto h-40 object-cover"
        src={urlFor(props.post.mainImage).url()}
      ></img>
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-4xl mt-10 mb-3">{props.post.title}</h1>
        <h2 className="text-xl text-gray-500 font-light">
          {props.post.description}
        </h2>
        <div className=" flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(props.post.author.image).url()}
          ></img>
          <p className="font-extralight text-sm">
            Blog post by
            <span className="text-green-600 extra-bold text-lg">
              {" "}
              {props.post.author.name}
            </span>{" "}
            -published at {new Date(props.post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10 w-[90%] ">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={props.post.body}
            serializers={{
              h1: (props) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }) => {
                <a className="text-blue-500 hover:underline" href={href}>
                  {children}
                </a>;
              },
            }}
          ></PortableText>
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500"></hr>
      {!submited ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={props.post._id}
          />

          <label htmlFor="" className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label htmlFor="" className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John Appleseed"
              type="email"
            />
          </label>
          <label htmlFor="" className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>

          {/* Errors will return when field validation fails */}

          <div className="">
            {errors.name && (
              <span className="text-red-500">
                - The Name field is required!
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment field is required!
              </span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email field is required!
              </span>
            )}
          </div>

          <input
            onSubmit={handleSubmit(onSubmit)}
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline 
            hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
            name=""
            id=""
          />
        </form>
      ) : (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto rounded">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      )}
      <div className="flex flex-col p-10 mt-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {props.post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;
export const getStaticPaths = async () => {
  const query = `
    *[_type=='post']{
        _id,
        slug{
            current
        }
    }
    `;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};
export const getStaticProps = async ({ params }) => {
  const query = `
    *[_type =='post' && slug.current ==$slug][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,image
        },
        'comments':*[
            _type =='comment'&&
            post._ref ==^._id &&
            approved ==true
        ],
        description,
        mainImage,
        slug,
        body
    }
    `;
  const post = await sanityClient.fetch(query, { slug: params?.slug });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
