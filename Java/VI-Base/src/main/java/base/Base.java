package base;

// Imports for https/http
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;

// Charset parsing
import java.nio.charset.Charset;

// Regex search imports
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// ArrayList
import java.util.ArrayList;

public class Base {
    public static void main(String[] args) throws IOException {
        // Testing here
        Base base = new Base();
        String version_data = base.getVersionData("canary");
        System.out.println(version_data);
    }

    public String getVersionData(String cli) throws IOException {
        ArrayList<String> arr = searchForVersionData(cli);
        String versionData; versionData = arr.get(arr.size() - 1);
        /*
          Return scheme: "Build Number: 00000, Version Hash: 0x0x0x0x0x0x0x0x0"
         */
        return versionData;
    }

    public static ArrayList<String> searchForVersionData(String cli) throws IOException {
        String url = rcLogic(cli);
        String asset = getLastAsset(getAssets(url));
        String assetReq = getBody(url + asset);
        Pattern ver_pattern = Pattern.compile("Build Number: [0-9]+, Version Hash: [a-zA-Z0-9]+", Pattern.CASE_INSENSITIVE);
        Matcher ver_matcher = ver_pattern.matcher(assetReq);
        ArrayList<String> ver_matches = new ArrayList<String>();

        while (ver_matcher.find()) {
            ver_matches.add(ver_matcher.group());
        }
        return ver_matches;
    }

    public static String rcLogic(String cli) {
        String hostname = "discord.com";
        if (cli.toLowerCase().equals("canary") || cli.toLowerCase().equals("ptb")) {
            hostname = cli + "." + hostname;
        } else {
            hostname = "discord.com";
        }
        return "https://" + hostname;
    }

    public static String getLastAsset(ArrayList<String> assets) throws IOException {
        return assets.get(assets.size() - 1);
    }

    public static ArrayList<String> getAssets(String url) throws IOException {
        String base = getBody(url + "/app");
        Pattern asset_pattern = Pattern.compile("/assets/[a-zA-Z0-9]+.js", Pattern.CASE_INSENSITIVE);
        Matcher asset_matcher = asset_pattern.matcher(base);
        ArrayList<String> assetMatches = new ArrayList<String>();
        while (asset_matcher.find()) {
            assetMatches.add(asset_matcher.group());
        }
        return assetMatches;
    }

    private static String readAll(Reader rd) throws IOException {
        StringBuilder strBuild = new StringBuilder();
        int cp;
        while ((cp = rd.read()) != -1) {
            strBuild.append((char) cp);
        }
        return strBuild.toString();
    }

    public static String getBody(String url) throws IOException {
        InputStream inputStream = new URL(url).openStream();
        try {
            BufferedReader read = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
            String data = readAll(read);
            return data;
        } finally {
            inputStream.close();
        }
    }
}
