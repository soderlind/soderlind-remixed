export default function ExitPreview(slugObject: any) {
  return (
    <div className="pointer-events-none fixed inset-0 flex h-screen w-screen items-end justify-center">
      <form
        className="pointer-events-auto"
        action="/resource/preview"
        method="POST"
      >
        <input type="hidden" name="slug" value={slugObject.slug} />
        <button className="bg-black p-4 font-bold text-white" type="submit">
          Exit Preview Mode
        </button>
      </form>
    </div>
  );
}
