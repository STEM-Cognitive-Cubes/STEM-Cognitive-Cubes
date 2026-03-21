#!/usr/bin/env bash
set -euo pipefail

echo "Preparing Firebase native config files for EAS build platform: ${EAS_BUILD_PLATFORM:-unknown}"

if [[ "${EAS_BUILD_PLATFORM:-}" == "android" ]]; then
  if [[ -n "${GOOGLE_SERVICES_JSON:-}" && -f "${GOOGLE_SERVICES_JSON}" ]]; then
    cp "${GOOGLE_SERVICES_JSON}" android/app/google-services.json
    echo "Copied android/app/google-services.json from EAS file secret."
  elif [[ -f "android/app/google-services.json" ]]; then
    echo "Using tracked android/app/google-services.json from repository."
  else
    echo "ERROR: Missing android/app/google-services.json."
    echo "Create EAS file secret GOOGLE_SERVICES_JSON or add android/app/google-services.json."
    exit 1
  fi
fi

if [[ "${EAS_BUILD_PLATFORM:-}" == "ios" ]]; then
  if [[ -n "${GOOGLE_SERVICE_INFO_PLIST:-}" && -f "${GOOGLE_SERVICE_INFO_PLIST}" ]]; then
    mkdir -p ios/STEMCognitiveCubes
    cp "${GOOGLE_SERVICE_INFO_PLIST}" ios/STEMCognitiveCubes/GoogleService-Info.plist
    echo "Copied ios/STEMCognitiveCubes/GoogleService-Info.plist from EAS file secret."
  elif [[ -f "ios/STEMCognitiveCubes/GoogleService-Info.plist" ]]; then
    echo "Using tracked ios/STEMCognitiveCubes/GoogleService-Info.plist from repository."
  else
    echo "ERROR: Missing ios/STEMCognitiveCubes/GoogleService-Info.plist."
    echo "Create EAS file secret GOOGLE_SERVICE_INFO_PLIST or add ios/STEMCognitiveCubes/GoogleService-Info.plist."
    exit 1
  fi
fi
