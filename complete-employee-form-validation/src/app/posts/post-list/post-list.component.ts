import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

import { PostCreateComponent } from "../post-create/post-create.component";
import { MatDialog } from "@angular/material";
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list-table-component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postsService: PostsService, public dialog: MatDialog, private confirmService: ConfirmationDialogComponent, private confirmationDialogService: ConfirmationDialogService) {}

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

  displayAlertDeleteEmployee = false
  displayAlertCreateEmployee = false

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
    this.displayAlertDeleteEmployee = true
    this.postsService.deletePost(postId);
  }


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
        this.displayAlertCreateEmployee = true
      });
    });
  }


  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
