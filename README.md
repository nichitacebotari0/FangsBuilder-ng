
# Fangs Builder angular  
Connected to backend: https://github.com/nichitacebotari0/api  
Previous iteration(front end only, built using Solidjs): https://github.com/nichitacebotari0/FangsBuilder  
  
## Features:
Front end navigation done using angular router.  
CRUD for heroes, hero augments, artifacts, actives and their parent entities(FK references in db like: AugmentCategory) through a number of angular reactive forms.  
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
    A) for single file: az storage blob upload -c '$web' --account-name accountname -f .\Heroes\Hero\filename.json  -n Heroes\Hero\filename.json  --overwrite  
    B) for bunch: az storage blob upload-batch --source .\assets --account-name prodstafangsbuilder2 --destination '$web' --destination-path \assets  
    C) In case I want to delete a dir:  az storage blob directory delete --account-name accountname --container-name '$web' --directory-path Heroes --recursive  
    Annoying because you need to use a --marker for subsequent calls until it finishes deleting everything  