# Ale's Home Childcare website

This repository is the source of truth for the public website.

## Release workflow

- `main` is production and publishes to `https://aleshomechildcare.com/`.
- `staging` is the review branch and publishes to the stable Cloudflare preview URL.
- Make and review changes on `staging` first.
- After approval, merge the exact reviewed `staging` commit into `main`.
- Tag each approved production release with a version such as `v1.0.0`.

## Rollback

- To discard staging work, revert the unwanted staging commit or restore `staging` to the current `main` commit.
- To undo a production release, roll Cloudflare back to the previous successful deployment immediately, then revert the corresponding commit on `main` so Git and production remain aligned.

Do not copy files manually from the live site. Git commits are the authoritative versions.
