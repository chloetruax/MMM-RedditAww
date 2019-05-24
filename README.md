# Reddit Writing Prompts Module

Simple magic mirror module that pulls a set number of posts from r/WritingPrompts. This was written to allow ideally 5 posts but could show more to get your creating brain going.



## Example Of the Post
![ExamplePosts](./MMM-RedditAww.PNG)

## Configuration

``` javascript
{
    module: "MMM-RedditWritingPrompts",
    position: "top-left", //position,
    postChangeTime: 60000, // Time the visible post refreshes default is one minute
    postUpdateTime: 1200000, // Time between reloads of pulls, default is 20 mins
    showVideos: true // Choose whether or not to show videos default is true.
},
```