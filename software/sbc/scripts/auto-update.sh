BRANCH="origin/main"
REPO_LOC="${HOME}/Lithography"
DOCKER_PATH="software/sbc"

cd "${REPO_LOC}"

git fetch origin
status="$(git log HEAD..${BRANCH} --oneline)"

if [[ "${status}" != "" ]]; then
	git merge ${BRANCH}
	cd "${DOCKER_PATH}"
	echo "Changes pulled. Stopping services"
	docker compose down
	echo "Services stopped. Building images"
	if docker compose build; then
		echo "Images built. Starting services"
		docker compose up
		echo "Services started"
	else
		echo "Could not build images"
		exit 1
	fi
else
	echo "Nothing to do"
fi

