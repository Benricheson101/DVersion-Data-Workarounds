use std::error;

use dversion::{DiscordBuild, Release};

#[tokio::main]
async fn main() -> Result<(), Box<dyn error::Error>> {
    let ver = DiscordBuild::fetch(Release::Canary).await?;

    println!("{:#?}", ver);

    Ok(())
}
