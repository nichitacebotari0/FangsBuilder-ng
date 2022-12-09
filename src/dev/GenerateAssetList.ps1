function Get-PathNames() {
    param (
        [Parameter(
            Position = 0, 
            Mandatory = $true, 
            ValueFromPipeline = $true,
            ValueFromPipelineByPropertyName = $true)]
        [String]$Directory
    )
    return Get-ChildItem $Directory | ForEach-Object { $Directory + "\" + $_.Name };
}

function Get-Heroes() {
    return Get-ChildItem .\assets\Augments
    | ForEach-Object {
        $name = $_.Name;
        return [ordered]@{
            Name     = $name.Trim();
            Icon     = Get-PathNames -Directory "assets\Icons_from_Nook" | Where-Object { $_.Contains($name) };
            Augments = Get-PathNames -Directory ("assets\Augments\" + $_.Name);
        } 
    }
}

$artifacts = Get-PathNames -Directory "assets\Artifacts";
$heroes = Get-Heroes

ConvertTo-Json $artifacts -Depth 3 | Out-File .\assets\Artifacts.json;
ConvertTo-Json $heroes -Depth 3 | Out-File .\assets\Heroes.json;
