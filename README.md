
# Fangs Builder angular  
domain: www.fangsbuilder.com  
Connected to backend: https://github.com/nichitacebotari0/api  
Previous iteration(front end only, built using Solidjs): https://github.com/nichitacebotari0/FangsBuilder  
The board: https://trello.com/b/olcRpYYN/fangs-builder  

# Goal
Need a place to share builds through(why previous iteration existed). And having people able to save builds, put their name on it, and vote on builds to better surface which ones are *actually* good would be nice. 

# The Plan:
1) Make the Build editor UI and slots similar to ingame, test it works with dummy data.  :heavy_check_mark:  
2) Automatically provision infrastructure(terraform) and deploy code(az cli) :heavy_check_mark:  
3) Serve through Azure CDN, and point domain to it through CNAME(www.fangsbuilder.com)  :heavy_check_mark:  
4) Make angular forms that connect to api for CRUD on things like augments,heroes,abilityType,etc.  :heavy_check_mark:  
5) Implement OAuth2 flow for discord, and store claims in cookies(JWT is stored as httponly cookie). Most of the work is done on api side for this. :heavy_check_mark:  
6) Populate data for some heroes and augments, allow sharing a frontend only link(feature parity with previous iteration)  :heavy_check_mark:  
7) Allow actual persistence for builds, add voting and a way to surface builds(list, with most voted at the top)  :heavy_check_mark:  
8) Work on the UI to make it look decent: navbar, text, admin forms arrangement and scrolling, discord icon and nickname once authed.  
9) ~~Add guides.~~ Builds have description  :heavy_check_mark:  
10) if perf allows it: when in build editor and making a build, dynamically search for, and surface builds/guides already made with those augments and show voting stats. Now youll know if someone already thought of the build, and whats the popularity.  
11) Solve the patch problem. If augment is removed/changed in game.Do we mark builds as being for particular patch, do we never delete augments only mark them as obsolete. Do we allow editing augments already in builds?(Probably yes, too troublesome to manage)  
12) Add hero details: Description, skills, etc. Would be ideal to embed videos showcasing the skills in action augments list under each skill(optionally with videos showcasing the modification) 


## Features:
Front end navigation done using angular router.  
CRUD for heroes, hero augments, artifacts, actives and their parent entities(FK references in db like: AugmentCategory) through a number of angular reactive forms.  
Data that doesn't change often is cached(using rxjs sharereplay to create an intermediary subject), and can be refetched when necessary.  
Admin Dashboard for Create Update and Delete is only shown to people with the necessary claims in cookies(theres also an httponly jwt cookie used by the backend api to auth).  
Authentication happens using OAuth2's authorization code grant flow: click discord icon > authorize on discord's website > get redirected to this app with auth code > send code to the api > api talks to discord using its client secret and the code, building claims using the info discord gives(in this case: what roles you have in the Fangs discord server) > api uses the claims and builds an httponly JWT(not visible to frontend) and some cookies with claims to check our rights(see admin dashboard).  
  
## Infrastructure as code:  
Made using terraform. terraform/main.tf contains all the azure infrastructure used to run the frontend:  
- Resource group containing all resources  
- Storage acount with option for serving web content  
- Azure cdn profile which contains cdn endpoint mapped to the above storage account and connected to the domain ( www.fangsbuilder.com )  
  
## CI/CD:  
Made using github actions. .github\workflows\cd.yaml contains the pipeline:  
- Part of it runs during push for sanity checks:  
    1) The project builds (ng build)  
    2) Terraform plan is generated and can be reviewed before deciding to trigger a full deployment  
- The full pipeline runs when triggered manually running the above and also applying:  
    1) Infrastructure changes (terraform apply)  
    2) Deploys the built angular app using az cli (copy from dist to the '$web' container in azure storage blob)  
  
  
### Manual stuff that needed doing:  
1. Create service principal(used for automated deployment): az ad sp create-for-rbac -n Name --role Contributor, "Storage Blob Data Contributor" --scopes /subscriptions/ff395dc...  
2. Upload static files(images) folders one by one to storage account using az cli(dont want to track images atm)  
    A) for single file: az storage blob upload -c '$web' --account-name prodstafangsbuilder2 -f .\assets\file.png  -n assets\file.png  --overwrite  
    B) for bunch: az storage blob upload-batch --source .\assets --account-name prodstafangsbuilder2 --destination '$web' --destination-path \assets  
    C) In case I want to delete a dir:  az storage blob directory delete --account-name prodstafangsbuilder2 --container-name '$web' --directory-path Heroes --recursive  
    Annoying because you need to use a --marker for subsequent calls until it finishes deleting everything  
