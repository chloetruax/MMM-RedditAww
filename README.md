# Reddit Aww Module

Simple magic mirror module that pulls a set number of posts from r/Aww. This will take the top posts from `hot` in `r/aww` and display them. It will display a random post and then refresh them until all posts are used once. It will then pull the new top posts (there might be some overlap depending on the `postChangeTime`) and cycles through them.



## Example Of the Post
![ExamplePosts](./MMM-RedditAww.PNG)

## Configuration

``` javascript
{
    module: "MMM-RedditAww",
    position: "top-left", //position,
    postChangeTime: 60000, // Time the visible post refreshes default is one minute
    showVideos: true // Choose whether or not to show videos default is true.
},
```