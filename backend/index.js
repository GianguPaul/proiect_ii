import express from "express";
import cors from "cors";

const app=express();
app.use(cors());




app.get("/getData",(req,res)=> {
    res.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et nulla congue, sollicitudin leo non, rhoncus ante. Nam vitae urna sed purus vestibulum aliquam ut ac ipsum. Donec accumsan nisl in sem ornare dapibus. Aenean feugiat in purus ac consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse eu imperdiet ligula. Vivamus et pellentesque leo, a dignissim metus. Nulla id neque at tortor ultricies condimentum quis eu ipsum.");
    

});


app.get("/getData",(req,res)=> {
    res.send("salut");
    

});
app.listen(5000,() => console.log("app is running"));