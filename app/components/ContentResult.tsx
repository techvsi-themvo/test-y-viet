import React from 'react';
type ContentResultProps = {
  listDataSnapshotRecordedVideo: { url: string; type: string }[];
  onRemove: (index: number) => void;
};
export default function ContentResult(props: ContentResultProps) {
  const { listDataSnapshotRecordedVideo, onRemove } = props;

  const handleDownload = async (url: string, type: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = url.split('/').pop() || '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="w-full flex flex-wrap gap-[8px]">
      {!!listDataSnapshotRecordedVideo?.length ? (
        listDataSnapshotRecordedVideo.map((file, index) => {
          return (
            <div
              className="w-[200px] h-[150px] bg-amber-100 relative"
              key={file.url}
            >
              {file.type === 'image' ? (
                <img
                  src={file.url}
                  alt={`media-${index}`}
                  className="w-full h-full rounded-md object-cover"
                />
              ) : file.type === 'video' ? (
                <video
                  controls
                  className="full h-full rounded-md"
                  src={file.url}
                />
              ) : (
                <p>Unsupported file type</p>
              )}

              <div className="absolute top-2 right-2 flex space-x-2 group-hover:opacity-100 transition-opacity z-10">
                <button
                  className="w-[32px] h-[32px] flex justify-center items-center bg-white hover:bg-gray-100 rounded-full cursor-pointer"
                  title="Tải xuống"
                  onClick={() => {
                    handleDownload(file.url, file.type);
                  }}
                >
                  💾
                </button>

                <button
                  onClick={() => onRemove(index)}
                  className="w-[32px] h-[32px] flex justify-center items-center bg-white hover:bg-gray-100 rounded-full cursor-pointer"
                  title="Xoá"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>Không có kết quả ảnh chụp nào...</p>
      )}
    </div>
  );
}
