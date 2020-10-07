import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  maxDate = new Date();

  displayAlertCreateEmployee = undefined;

  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      birthdate: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      address: new FormControl(null, { validators: [Validators.required] }),
      phoneNumber: new FormControl(null, {
        validators: [Validators.required, Validators.pattern("[0-9]{10}")],
      }),

      imageFile :  new FormControl(null, {
        validators: [Validators.required, this.postsService.fileExtensionValidator('jpg, png, wav, mp4')],
      }),

    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            name: postData.name,
            email: postData.email,
            birthdate: postData.birthdate,
            imagePath: postData.imagePath,
            phoneNumber: postData.phoneNumber,
            address: postData.address,
          };

          console.log(postData._id, "post data _id create post line 68");

          this.form.setValue({
            name: postData.name,
            email: postData.email,
            birthdate: postData.birthdate,
            image: this.post.imagePath,
            phoneNumber: this.post.phoneNumber,
            address: this.post.address,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      console.log("Invalid form>>>>>>>>>");

      return;
    }

    //console.log("inside if create component", this.form.value);
    this.isLoading = true;

    if (this.mode === "create") {
      console.log("inside if create component>>>>>>>>>>>>>>>>>>");
      this.displayAlertCreateEmployee = true;

      console.log(this.displayAlertCreateEmployee);

      this.postsService.addPost(
        this.form.value.name,
        this.form.value.email,
        this.form.value.birthdate,
        this.form.value.image,
        this.form.value.phoneNumber,
        this.form.value.address
      );
    } else {
      console.log("inside else", this.form);

      this.displayAlertCreateEmployee = true;
      this.postsService.updatePost(
        this.postId,
        this.form.value.name,
        this.form.value.email,
        this.form.value.birthdate,
        this.form.value.image,
        this.form.value.phoneNumber,
        this.form.value.address
      );
    }
    this.form.reset();
  }

  get email() {
    return this.form.get("email");
  }

  get phoneNumber() {
    return this.form.get("phoneNumber");
  }




}
