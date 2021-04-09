set theURL to "https://canary.discord.com/app"
set firstReq to do shell script "curl " & quoted form of theURL
set asset_reg to "/assets/[a-zA-Z0-9]+.js*"

match(firstReq, asset_reg)
# TODO: Find a way for this regex function to return all regex results, it is only returning the first regex result.
on match(str, reg)
	local ignoreCase, extraCommand
	set ignoreCase to "a" is "A"
	if ignoreCase then
		set extraCommand to "shopt -s nocasematch; "
	else
		set extraCommand to ""
	end if
	tell me to do shell script "export LANG='" & user locale of (system info) & ".UTF-8'; shopt -s compat31; " & extraCommand & "[[ " & quoted form of str & " =~ " & quoted form of reg & " ]] && printf '%s\\n' \"${BASH_REMATCH[@]}\" || printf ''"
	return paragraphs of result
end match


# TODO: Add another request so the rest can be searched for (WIP)
