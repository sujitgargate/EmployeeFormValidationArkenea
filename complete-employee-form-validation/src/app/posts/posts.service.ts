import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  get() {
    throw new Error("Method not implemented.");
  }
  static http: HttpClient;

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              id: post._id,
              name: post.name,
              email: post.email,
              birthdate: post.birthdate,
              imagePath: post.imagePath,
              phoneNumber: post.phoneNumber,
              address: post.address,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      email: string;
      birthdate: string;
      imagePath: string;
      phoneNumber: string;
      address: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(
    name: string,
    email: string,
    birthdate: string,
    image: File,
    phoneNumber: string,
    address: string
  ) {
    const postData = new FormData();

    console.log("postData>>", postData);

    postData.append("name", name);
    postData.append("email", email);
    postData.append("birthdate", birthdate);
    postData.append("image", image, name);
    postData.append("phoneNumber", phoneNumber);
    postData.append("address", address);

    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          name: name,
          email: email,
          birthdate: birthdate,
          imagePath: responseData.post.imagePath,
          phoneNumber: phoneNumber,
          address: address,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(
    id: string,
    name: string,
    email: string,
    birthdate: string,
    image: File | string,
    phoneNumber: string,
    address: string
  ) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("name", name);
      postData.append("email", email);
      postData.append("birthdate", birthdate);
      postData.append("image", image, name);
      postData.append("phoneNumber", phoneNumber);
      postData.append("address", address);
    } else {
      postData = {
        id: id,
        name: name,
        email: email,
        birthdate: birthdate,
        imagePath: image,
        phoneNumber: phoneNumber,
        address: address,
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        const post: Post = {
          id: id,
          name: name,
          email: email,
          birthdate: birthdate,
          imagePath: "",
          phoneNumber: "",
          address: "",
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: String) {
    console.log('inside delete post services');

    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log('updated post ', updatedPosts);

      });
  }

  // deletePost(postId: string) {
  //   this.http
  //     .delete("http://localhost:3000/api/posts/" + postId)
  //     .subscribe(() => {
  //       const updatedPosts = this.posts.filter((post) => post.id !== postId);
  //       this.posts = updatedPosts;
  //       this.postsUpdated.next([...this.posts]);
  //     });
  // }

}
