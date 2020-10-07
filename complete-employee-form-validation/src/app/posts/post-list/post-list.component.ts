import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

import { PostCreateComponent } from "../post-create/post-create.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list-table-component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postsService: PostsService, public dialog: MatDialog) {}

  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  data: any;
  dataSource: Object;
  displayedColumns: string[] = [
    "name",
    "image",
    "phoneNumber",
    "birthdate",
    "address",
    "actions",
  ];

  //Employee:any= [];

  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });

    //this.getPosts();
  }

  // getPosts() {
  //   PostsService.get().subscribe((res) => {
  //     this.dataSource = res;
  //   });
  // }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }


  // onDelete() {
  //   this.postsService.delete(postId: string).subscribe(res => {
  //     console.log(res);
  //     this.router.navigate(['list'])

  //   })
  // }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  openDialogForEdit(id: any) {
    console.log("testid", id);

    this.postsService.getPost(id).subscribe((res) => {
      console.log(res);
      this.data = res;
      console.log(this.data);

      const dialogRef = this.dialog.open(PostCreateComponent, {
        data: this.data,
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    });
  }
}
