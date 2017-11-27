rsync -r src/ docs/
rsync build/contracts/Chat.json docs/
git add .
git commit -m "Adding frontend files to Github Pages"
git push
