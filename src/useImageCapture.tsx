import { useEffect } from 'react';
import { selectLocalVideoTrackID, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import { RekognitionClient, DetectLabelsCommand, DetectFacesCommand } from '@aws-sdk/client-rekognition';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

function openProctorLink() {
  const url = window.location.href.replace('student/', '');
  window.open(url, '_blank');
}

export const useImageCapture = () => {
  const videoTrackId = useHMSStore(selectLocalVideoTrackID);
  const hmsActions = useHMSActions();
  useEffect(() => {
    const id = videoTrackId;
    const isStudent = window.location?.pathname.includes('student');
    if (!id || !isStudent) {
      return;
    }

    const rekognitionClient = new RekognitionClient({
      region: 'ap-south-1',
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: 'ap-south-1' }),
        identityPoolId: 'ap-south-1:cae204c8-80d1-4664-8ba8-730ba83056dc',
      }),
    });

    const video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    setInterval(() => {
      const nativeTrack = hmsActions.getNativeTrackById(id);
      if (nativeTrack) {
        const { width = 320, height = 240 } = nativeTrack.getSettings();
        video.width = width;
        video.height = height;
        video.srcObject = new MediaStream([nativeTrack]);
        video.play();
        video.oncanplay = async () => {
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = document.createElement('img');
            img.height = 120;
            img.crossOrigin = 'anonymous';
            img.src = canvas.toDataURL();
            canvas.toBlob(async blob => {
              if (!blob) {
                return;
              }
              const buffer = await blob.arrayBuffer();
              const array = new Uint8Array(buffer);
              const command = new DetectLabelsCommand({
                Image: { Bytes: array },
                MaxLabels: 10,
                Features: ['GENERAL_LABELS'],
                Settings: {
                  GeneralLabels: {
                    LabelInclusionFilters: ['Phone', 'Book', 'Reading'],
                  },
                },
              });
              const { Labels } = await rekognitionClient.send(command);
              if (Labels?.length) {
                if (window.confirm(`Alert: ${Labels[0].Name} detected`)) {
                  openProctorLink();
                }
                return;
              }

              const detectFacesCommand = new DetectFacesCommand({
                Image: { Bytes: array },
              });

              const { FaceDetails } = await rekognitionClient.send(detectFacesCommand);
              if (FaceDetails && FaceDetails.length > 1) {
                if (window.confirm(`Alert: Other Person is present`)) {
                  openProctorLink();
                }
              }

              /* const file = document.getElementById('target-image') as HTMLInputElement;
              if (file?.files?.[0]) {
                const targetBuffer = await file.files?.[0].arrayBuffer();
                const targetArray = new Uint8Array(targetBuffer);
                const compareCommand = new CompareFacesCommand({
                  SourceImage: { Bytes: array },
                  TargetImage: { Bytes: targetArray },
                  SimilarityThreshold: 85,
                });

                const { FaceMatches, UnmatchedFaces } = await rekognitionClient.send(compareCommand);
                if (!FaceMatches?.length) {
                  if (window.confirm(`Alert: Face does not match`)) {
                    openProctorLink();
                  }
                  return;
                }

                if (UnmatchedFaces?.length) {
                  if (window.confirm(`Alert: Other faces are visible`)) {
                    openProctorLink();
                  }
                }
              }
 */
            });
          }
        };
      }
    }, 5000);
  }, [videoTrackId, hmsActions]);
};
