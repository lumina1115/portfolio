$ErrorActionPreference = "Stop"

$docxPath = "E:\portfolio\output\resume\zongxuezhen_resume.docx"
$pdfPath = "E:\portfolio\output\resume\zongxuezhen_resume.pdf"

$word = $null
$document = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $document = $word.Documents.Open(
        $docxPath,
        [ref]$false,
        [ref]$true,
        [ref]$false
    )
    $document.ExportAsFixedFormat($pdfPath, 17)
    $document.Close()
    $word.Quit()
}
finally {
    if ($document -ne $null) {
        try { $document.Close() } catch {}
    }
    if ($word -ne $null) {
        try { $word.Quit() } catch {}
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
