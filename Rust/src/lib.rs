use std::error;

use regex::Regex;
use reqwest::Client;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub enum Release {
    Canary,
    Ptb,
    Stable,
}

impl From<String> for Release {
    fn from(name: String) -> Self {
        Self::from(name.as_str())
    }
}

impl From<&str> for Release {
    fn from(name: &str) -> Self {
        match name {
            "canary" => Self::Canary,
            "ptb" => Self::Ptb,
            "stable" => Self::Ptb,
            &_ => panic!("Unknown release"),
        }
    }
}

impl Release {
    pub fn into_url(&self) -> String {
        match self {
            Self::Canary => "https://canary.discord.com",
            Self::Ptb => "https://ptb.discord.com",
            Self::Stable => "https://discord.com",
        }
        .into()
    }
}

#[derive(Debug, Serialize)]
pub struct DiscordBuild {
    pub build_id: String,
    pub build_hash: String,
    pub build_num: u32,
    pub release_ch: Release,
}

impl DiscordBuild {
    pub async fn fetch(
        release: Release,
    ) -> Result<Self, Box<dyn error::Error>> {
        let client = Client::new();

        let app_page = client
            .get(format!("{}/app", &release.into_url()))
            .send()
            .await?
            .text()
            .await?;

        let js_file = Self::extract_js_file_name(&app_page)
            .expect("Unable to find JavaScript asset file name");

        let asset_page = client
            .get(format!("{}/assets/{}", &release.into_url(), &js_file))
            .send()
            .await?
            .text()
            .await?;

        let build_num: u32 = Self::extract_build_number(&asset_page)
            .expect("Unable to find build number")
            .parse()?;

        let build_hash = Self::extract_build_hash(&asset_page)
            .expect("Unable to find build hash");

        let build_id: String = build_hash[0..8].into();

        Ok(Self {
            build_id,
            build_hash,
            build_num,
            release_ch: release,
        })
    }

    fn extract_js_file_name(js: &str) -> Option<String> {
        let regex = Regex::new(r"/assets/([a-zA-Z0-9]+.js)").unwrap();

        let caps = regex.captures_iter(js).collect::<Vec<regex::Captures>>();
        Some(caps[caps.len() - 1][1].into())
    }

    fn extract_build_number(js: &str) -> Option<String> {
        let regex = Regex::new(r"Build Number: ([0-9]+)").unwrap();

        Some(regex.captures(js)?[1].into())
    }

    fn extract_build_hash(js: &str) -> Option<String> {
        let regex = Regex::new(r"Version Hash: ([a-zA-Z0-9]+)").unwrap();

        Some(regex.captures(js)?[1].into())
    }
}
