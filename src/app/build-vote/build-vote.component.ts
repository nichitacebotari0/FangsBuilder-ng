import { Component, Input, OnInit } from '@angular/core';
import { Build } from '../Models/Build';
import { BuildVote } from '../Models/BuildVote';
import { BuildService } from '../Services/build.service';

@Component({
  selector: 'app-build-vote',
  templateUrl: './build-vote.component.html',
  styleUrls: ['./build-vote.component.less']
})
export class BuildVoteComponent implements OnInit {

  constructor(private buildService: BuildService) { }

  ngOnInit(): void {
  }
  @Input() build: Build | undefined;
  @Input() existingVote: BuildVote | undefined | null;

  vote(up: boolean) {
    if (!this.build)
      return;

    const buildVote: BuildVote = {
      id: 0,
      buildId: this.build.id,
      isUpvote: up
    }

    if (!this.existingVote) {
      this.buildService.addVote(buildVote)
        .subscribe(x => this.addVote(x));
      return;
    }

    if (this.existingVote.isUpvote == up) {
      this.buildService.removeVote(this.existingVote.id)
        .subscribe(x => this.removeVote());
      return;
    }
    buildVote.id = this.existingVote.id
    this.buildService.changeVote(this.existingVote.id, buildVote)
      .subscribe(x => this.changeVote(buildVote));
  }

  addVote(vote: BuildVote) {
    if (!this.existingVote) {
      this.existingVote = vote;
      if (vote.isUpvote)
        this.build!.upvotes++
      else
        this.build!.downvotes++

      return;
    }
  }

  removeVote() {
    if (!this.existingVote)
      return;

    if (this.existingVote?.isUpvote)
      this.build!.upvotes--
    else
      this.build!.downvotes--

    this.existingVote = undefined;
  }

  changeVote(vote: BuildVote) {
    if (vote.isUpvote) {
      this.build!.upvotes++
      this.build!.downvotes--
    }
    else {
      this.build!.upvotes--
      this.build!.downvotes++
    }
    this.existingVote = vote;
  }
}
