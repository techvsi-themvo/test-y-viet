'use client';

import { useEffect, useRef, useState } from 'react';
import ButtonSelectCamera from './components/ButtonSelectCamera';
import { ToastContainer } from 'react-toastify';
import { configToast, handleShowToast } from '@/lib/handleToasts';
import Modal from './components/Modal';
import clsxm from '@/lib/clsxm';
import ListUser from './components/ListUser';
import ContentResult from './components/ContentResult';
import { saveDataImgOrVideo } from '@/lib/handleApi';
import { removeDataFromLocalStorage } from '@/lib/handleSaveData';
import { useRouter } from 'next/navigation';

export type Customer = {
  id: number;
  name: string;
  birthday: string; // yyyy-mm-dd
  gender: 'Nam' | 'Nữ' | 'Khác';
};

const resolutions = [
  { label: '640x480 (VGA)', width: 640, height: 480 },
  { label: '1280x720 (HD)', width: 1280, height: 720 },
  { label: '1920x1080 (Full HD)', width: 1920, height: 1080 },
];
export default function Home() {
  const router = useRouter();
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState(resolutions[0]);
  const [isOpenSelectCamera, setIsOpenSelectCamera] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<Customer | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showModalNoCamera, setShowModalNoCamera] = useState(false);

  const [listDataSnapshotRecordedVideo, setListDataSnapshotRecordedVideo] =
    useState<any[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const fetchDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
        if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId); // Chọn thiết bị đầu tiên mặc định
        } else {
          setShowModalNoCamera(true);
        }
      };
      fetchDevices();
    }
  }, []);

  useEffect(() => {
    const startStream = async () => {
      if (selectedDeviceId && selectedResolution) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { exact: selectedResolution.width },
            height: { exact: selectedResolution.height },
          },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    };
    startStream();
  }, [selectedDeviceId]);

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = async () => {
    if (!userSelected) {
      return;
    }
    const canvas = document.createElement('canvas');
    if (!videoRef.current) return;

    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/png');
      const name = `${userSelected.name}_${new Date().getTime()}.png`;
      const file = await dataURLtoFile(base64, name);

      if (file) {
        await saveDataImgOrVideo(file, name)
          .then((res) => {
            const newData = {
              url: res,
              type: 'image',
            };
            listDataSnapshotRecordedVideo.push(newData);
            setListDataSnapshotRecordedVideo([
              ...listDataSnapshotRecordedVideo,
            ]);
          })
          .catch((err) => {
            handleShowToast('Lưu không thành công, vui lòng thử lại', 'error');
          });
      }
    }
  };

  const handleRecord = async () => {
    if (!videoRef.current || !userSelected) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const name = `${userSelected.name}_${new Date().getTime()}.webm`;
      await saveDataImgOrVideo(blob, name)
        .then((res) => {
          const newData = {
            url: res,
            type: 'video',
          };
          listDataSnapshotRecordedVideo.push(newData);
          setListDataSnapshotRecordedVideo([...listDataSnapshotRecordedVideo]);
        })
        .catch((err) => {
          handleShowToast('Lưu không thành công, vui lòng thử lại', 'error');
        });
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleRemove = (index: number) => {
    const newData = listDataSnapshotRecordedVideo.filter(
      (item, idx) => idx !== index,
    );
    setListDataSnapshotRecordedVideo([...newData]);
  };

  return (
    <div className="w-full h-[100vh] flex flex-col ">
      <div className="w-full py-[24px] px-[16px] border-b-[1px] border-[#E5E7EB] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Hệ thống siêu âm</h1>
        <button
          className="absolute right-[24px] top-[24px] cursor-pointer"
          onClick={() => {
            removeDataFromLocalStorage('username');
            removeDataFromLocalStorage('token');
            removeDataFromLocalStorage('id');
            router.push('/login');
          }}
        >
          Thoát
        </button>
      </div>
      <div className="w-full flex flex-1 bg-amber-200 p-[16px] gap-[24px]">
        <div className="w-[400px] flex flex-col gap-[16px]">
          <ButtonSelectCamera
            onClick={() => setIsOpenSelectCamera(true)}
            idCamera={selectedDeviceId}
          />
          <div
            className={clsxm(
              'w-full flex justify-between items-center gap-[8px]',
            )}
            onClick={() => {
              if (!userSelected) {
                handleShowToast(
                  'Vui lòng chọn bệnh nhân trước khi thược hiện thao tác này',
                  'error',
                );
              }
            }}
          >
            {!isRecording && (
              <button
                onClick={handleRecord}
                className="w-[100%] px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
              >
                🎥 Quay video
              </button>
            )}

            {isRecording && (
              <button
                onClick={handleStop}
                className="w-[100%] px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer"
              >
                🔴 Dừng quay
              </button>
            )}

            <button
              onClick={handleCapture}
              className=" w-[100%] px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
            >
              📸 Chụp hình
            </button>
          </div>

          <div className="w-[400px] h-[400px] flex items-center justify-center rounded-[8px] bg-white">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxWidth: 600 }}
            />
          </div>

          <ListUser
            userSelected={userSelected}
            onSelectUser={(user) => {
              setListDataSnapshotRecordedVideo([]);
              setUserSelected(user);
            }}
          />
        </div>
        <div className="flex flex-1 flex-col">
          <ContentResult
            listDataSnapshotRecordedVideo={listDataSnapshotRecordedVideo}
            onRemove={handleRemove}
          />
        </div>
      </div>
      <ToastContainer {...configToast} />
      <Modal
        isOpen={isOpenSelectCamera}
        onClose={() => setIsOpenSelectCamera(false)}
      >
        <div className="w-[400px] flex flex-col gap-[14px]">
          <p className="text-[18px]">Danh sách Camera:</p>
          <div className="flex flex-col gap-[8px]">
            <div style={{ marginBottom: 8 }}>
              <label>Chọn độ phân giải: </label>
              <select
                onChange={(e) =>
                  setSelectedResolution(
                    resolutions.find((r) => r.label === e.target.value) ||
                      resolutions[0],
                  )
                }
                value={selectedResolution.label}
              >
                {resolutions.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            {videoDevices.map((device, index) => {
              return (
                <div key={index} className="flex gap-[8px]  justify-between">
                  <div className="flex flex-col gap-[8px]">
                    <p className="text-[14px]">📸 {device.label}</p>
                  </div>
                  <div
                    className="h-fit p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                    onClick={() => {
                      setIsOpenSelectCamera(false);
                      if (device.deviceId === selectedDeviceId) {
                        return;
                      }

                      setSelectedDeviceId(device.deviceId);
                      if (videoRef.current) {
                        videoRef.current.srcObject = null;
                      }
                    }}
                  >
                    Chọn
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!showModalNoCamera}
        onClose={() => {}}
        isShowCloseIcon={false}
      >
        <div className="w-full p-[24px]">
          <p>▲ Không có Camera được kết nối, vui lòng kiểm tra lại!</p>
        </div>
      </Modal>
    </div>
  );
}
